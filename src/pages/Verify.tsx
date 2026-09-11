import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/lib/auth';
import { useInstitution } from '@/lib/contexts/InstitutionContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, CheckCircle2, XCircle, User, Building2, Calendar, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { gooeyToast } from 'goey-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { resolvePhotoUrl } from '@/lib/photo';
import LoadingState from '@/components/LoadingState';

interface VerificationResult {
  found: boolean;
  data?: {
    index_number: string;
    full_name: string;
    photo_url: string | null;
    organization: string;
    institutions: { name: string } | null;
    issued_at: string;
    expires_at: string;
    status: string;
    metadata: Record<string, unknown> | null;
  };
}

export default function Verify() {
  const { user, isLoading: authLoading } = useAuth();
  const { institutionId } = useInstitution();
  const [indexNumber, setIndexNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);

  // Resolve the record photo (storage path or external URL) into a displayable URL
  useEffect(() => {
    let cancelled = false;
    const url = result?.found ? result.data?.photo_url ?? null : null;
    if (!url) {
      setPhotoSrc(null);
      return;
    }
    resolvePhotoUrl(url).then((resolved) => {
      if (!cancelled) setPhotoSrc(resolved);
    });
    return () => {
      cancelled = true;
    };
  }, [result]);
  const { toast } = useToast();

  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingState label="Loading verification" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!institutionId) {
    return (
      <Layout>
        <div className="container py-12">
          <Card className="mx-auto max-w-xl border-destructive/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <CardTitle className="font-display text-lg">Access Restricted</CardTitle>
                  <CardDescription>
                    You must be a member of an institution to verify identities.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Join or register an institution from your dashboard to gain access to verification.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!indexNumber.trim()) {
      gooeyToast.error('Identification number required', {
        description: 'Please enter an identification number to verify.',
      });
      return;
    }

    setIsSearching(true);
    setResult(null);

    try {
      // Search for the index number
      const { data, error } = await supabase
        .from('index_records')
        .select('index_number, full_name, photo_url, organization, issued_at, expires_at, status, metadata, institutions(name)')
        .eq('index_number', indexNumber.trim().toUpperCase())
        .eq('status', 'active')
        .maybeSingle();

      if (error) {
        console.error('Search error:', error);
        gooeyToast.error('Search failed', {
          description: 'An error occurred while searching. Please try again.',
        });
        return;
      }

      // Log the verification attempt
      await supabase.from('verification_logs').insert({
        index_number: indexNumber.trim().toUpperCase(),
        verified_by: user.id,
        verification_result: data !== null,
        user_agent: navigator.userAgent,
        institution_id: institutionId,
      });

      if (!data) {
        gooeyToast.error('Not Found', {
          description: `No verified record matches identification number "${indexNumber.trim().toUpperCase()}".`,
          duration: 5000,
        });
      }

      setResult({
        found: data !== null,
        data: data
          ? { ...data, metadata: (data.metadata ?? null) as Record<string, unknown> | null }
          : undefined,
      });

    } catch (err) {
      console.error('Verification error:', err);
      gooeyToast.error('Error', {
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const isExpired = result?.data?.expires_at && new Date(result.data.expires_at) < new Date();
  const isRegisteredStudent = result?.data ? result.data.metadata?.registered_student !== false : false;

  return (
    <Layout>
      <div className="container py-12">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl mb-2">
              Verify Identity
            </h1>
            <p className="text-muted-foreground">
              Enter an identification number to verify someone's identity.
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter identification number (e.g., ID-2024-001)"
                    value={indexNumber}
                    onChange={(e) => setIndexNumber(e.target.value.toUpperCase())}
                    className="pl-10 uppercase"
                  />
                </div>
                <Button type="submit" disabled={isSearching} className="gradient-primary border-0">
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Verify'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <AnimatePresence mode="wait">
            {result && result.found && result.data && (
              <motion.div
                key="found-card"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              >
                <Card className="border-success/50 animate-scale-in">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/20">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-display">Identity Verified</CardTitle>
                        <CardDescription>Record found in the database</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {isExpired && (
                      <div className="mb-4 flex items-center gap-2 rounded-lg bg-warning/20 p-3 text-warning-foreground">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">This ID has expired</span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-6">
                      {photoSrc ? (
                        <div className="flex-shrink-0">
                          <img
                            src={photoSrc}
                            alt={result.data.full_name}
                            className="h-32 w-32 rounded-xl object-cover border border-border"
                          />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 h-32 w-32 rounded-xl bg-secondary flex items-center justify-center border border-border">
                          <User className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}

                      <div className="flex-1 space-y-4">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Full Name</div>
                          <div className="font-display text-lg font-semibold">{result.data.full_name}</div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              Organization
                            </div>
                            <div className="font-medium">
                              {result.data.institutions?.name ?? result.data.organization}
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Valid Period
                            </div>
                            <div className="font-medium">
                              {new Date(result.data.issued_at).toLocaleDateString()} -{' '}
                              {new Date(result.data.expires_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={isExpired ? 'destructive' : 'default'} className={!isExpired ? 'bg-success' : ''}>
                            {isExpired ? 'Expired' : 'Active'}
                          </Badge>
                          <Badge variant="outline" className={isRegisteredStudent ? 'border-success text-success' : 'border-destructive text-destructive'}>
                            {isRegisteredStudent ? 'Registered' : 'Not Registered'}
                          </Badge>
                          <Badge variant="outline" className="uppercase">
                            {result.data.index_number}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {result && !result.found && (
              <motion.div
                key="not-found-gooey-toast"
                initial={{ opacity: 0, scale: 0.9, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="relative overflow-hidden rounded-2xl md:rounded-3xl border-2 border-destructive/40 bg-destructive/10 dark:bg-destructive/20 p-5 sm:p-7 md:p-10 shadow-2xl shadow-destructive/15 backdrop-blur-md"
              >
                {/* Background gooey ambient glow blobs */}
                <div className="absolute -top-12 -right-12 h-40 w-40 md:h-56 md:w-56 rounded-full bg-destructive/20 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 h-40 w-40 md:h-56 md:w-56 rounded-full bg-destructive/15 blur-3xl pointer-events-none" />

                <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 md:gap-6">
                  <div className="flex items-start sm:items-center gap-4 md:gap-6">
                    {/* Gooey Animated Icon Container */}
                    <motion.div
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                      className="flex-shrink-0 flex h-12 w-12 sm:h-14 sm:w-14 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-destructive/20 text-destructive border border-destructive/30 shadow-inner"
                    >
                      <XCircle className="h-7 w-7 sm:h-8 sm:w-8 md:h-12 md:w-12 text-destructive" />
                    </motion.div>

                    {/* Text content - Large on PC (md:) */}
                    <div className="space-y-1 md:space-y-2">
                      <div className="flex flex-wrap items-center gap-2 md:gap-3">
                        <h3 className="font-display font-extrabold text-destructive text-xl sm:text-2xl md:text-4xl tracking-tight">
                          Not Found
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-sm sm:text-base md:text-xl font-medium leading-relaxed max-w-xl">
                        No verified record matches this identification number. Please verify the ID and try again.
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant="destructive"
                    className="px-3 py-1 sm:px-4 sm:py-1.5 md:px-5 md:py-2 text-xs sm:text-sm md:text-base font-semibold rounded-full shadow-lg self-start sm:self-center"
                  >
                    Not Registered
                  </Badge>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!result && (
            <div className="text-center text-muted-foreground py-12">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Enter an identification number above to verify an identity</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}